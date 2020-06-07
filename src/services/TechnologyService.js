import { HealthInstitutionDAO, TechnologyDAO, ActivityDAO, RoleDAO } from "../models"

export default class TechnologyService {
  /**
   * Retorna as tecnologias de uma instituição de saúde.
   *
   * @param {number} institutionID Código (PK) da instituição de saúde.
   * @returns {{ id: number, name: string }[]} Todas as tecnologias relacionadas à instituição.
   */
  async listTechnologies(institutionID) {
    const institution = await HealthInstitutionDAO.findByPk(institutionID, {
      include: TechnologyDAO,
    })

    const technologies = institution?.technologies.map(tech => {
      return {
        id: tech.id,
        name: tech.name,
      }
    })

    for (const tech of technologies) {
      const technology = await TechnologyDAO.findByPk(tech.id, { include: ActivityDAO })
      tech.activities = technology.activities.map(activity => {
        return {
          id: activity.id,
          name: activity.name,
          shortName: activity.shortName,
        }
      })
    }

    return technologies
  }

  /**
   * Exporta a definição de uma tecnologia (matriz atividades x ocupações).
   *
   * @param {number} technologyID ID da tecnologia cuja definição deve ser exportada.
   * @returns {TechnologyDefinition} Objeto com a definição de uma tecnologia.
   *
   * ----
   *
   * Objeto com a definição de uma tecnologia (atividades, ocupações e matriz atividade x ocupação).
   * @typedef {Object} TechnologyDefinition
   * @property {{ name: string; shortName: string }[]} activities Lista de atividades, com nome completo e nome curto (se cadastrado), ordenadas pelo nome.
   * @property {{ name: string; shortName: string }[]} roles Lista de ocupações, com nome completo e nome curto (se cadastrado), ordenadas pelo nome.
   * @property {(string | null)[]} matrix Matriz com a definição de quais ocupações executam quais atividades, ordenada de acordo com o array em `activities`.
   */
  async exportTechnology(technologyID) {
    // TODO: implementar na task B02 (https://trello.com/c/84Ukf1dM)

    /*const technologyTable = await TechnologyDAO.findByPk(technologyID)

    if (!technologyTable){
      return null;
    }*/

    const results = await TechnologyDAO.findByPk(technologyID, {
      include: [
        {
          model: ActivityDAO,
          include: [RoleDAO],
        },
      ],
    })

    const maxIDRole = Math.max(
      results.activities.map(activity => {
        return Math.max(
          activity.roles.map(role => {
            return role.id
          })
        )
      })
    )

    const maxIDActivity = Math.max(
      results.activities.map(activity => {
        return activity.id
      })
    )

    const grid = new Array(maxIDActivity)
    for (let i = 0; i < grid.length; i += 1) {
      grid[i] = new Array(maxIDRole).fill("")
    }

    const arRole = new Array(maxIDRole)

    const arActiv = new Array(maxIDActivity)

    let yValue
    let xValue
    for (const activity of results.activities) {
      yValue = activity.id
      arActiv[yValue - 1] = {
        name: activity.name,
        shortName: activity.short_name,
      }
      for (const role of activity.roles) {
        xValue = role.id
        arRole[xValue - 1] = {
          name: role.name,
          shortName: role.short_name,
        }
        grid[yValue - 1][xValue - 1] = "x"
      }
    }

    // exemplo de retorno
    return {
      technologyName: results.name, //technologyTable.name,
      activities: arActiv,
      roles: arRole,
      matrix: grid,
    }
  }
}
