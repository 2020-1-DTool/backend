import { Op } from "sequelize"
import { ExecutionDAO } from "../models"

export default class ExecutionService {
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

    async createExecution(array){

    
    }
}