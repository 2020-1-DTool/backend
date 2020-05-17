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
}
