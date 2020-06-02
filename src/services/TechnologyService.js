import { HealthInstitutionDAO, TechnologyDAO, ActivityDAO } from "../models"

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
          shortName: activity.short_name,
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

    // exemplo de retorno
    return {
      activities: [
        {
          name: "Avaliação da recepção do paciente",
          shortName: "Av. recepção pac."
        }
      ],
      roles: [
        {
          name: "Assistente do cirurgião 1",
          shortName: "Assist. cirurg. 1"
        }
      ],
      matrix: [
        [null, null, "X", null, "X", "X"]
      ]
    }
  }
}
