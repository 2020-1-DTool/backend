import { Op } from "sequelize"
import Auth from "./Auth"
import { HealthInstitutionDAO } from "../models"

export default class HealthInstitutionService {
  /**
   * Retorna a permissão de um código de instituição e as informações da instituição
   * relacionada.
   *
   * Se o código não fizer referência a nenhuma instituição conhecida, retorn `null`.
   *
   * @param {string} accessCode Código de acesso de uma instituição.
   * @returns {{ permission: string, institution: { name: string }}} Objeto com
   * permissão do código e informações da instituição. Se o código não corresponder
   * a nenhuma instituição, retorna `null`.
   */
  async getInformations(accessCode) {
    // SELECT de instituições cujo código de contagem de tempo ou gestão seja igual ao código informado
    const institution = await HealthInstitutionDAO.findOne({
      where: {
        [Op.or]: [{ timeTrackingCode: accessCode }, { administrationCode: accessCode }],
      },
    })

    // instituição não encontrada
    if (!institution) {
      return null
    }

    // definir a permissão de acordo com o campo que deu "match" no SELECT
    let permission
    if (institution.timeTrackingCode === accessCode) {
      permission = Auth.PERMISSIONS.TIME_TRACKING
    } else {
      permission = Auth.PERMISSIONS.ADMIN_HOSPITAL
    }

    return {
      id: institution.id,
      permission,
      institution: {
        name: institution.name,
      },
    }
  }
}
