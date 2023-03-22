import type { NextApiRequest, NextApiResponse } from 'next'
import { jsonRes } from '@/service/response'
import { authSession } from '@/service/auth'
import * as k8s from '@kubernetes/client-node'
import {
  ApplyYaml,
  CRDMeta,
  GetCRD,
  GetUserDefaultNameSpace,
  K8sApi,
} from '@/service/kubernetes'
import * as yaml from 'js-yaml'

const terminalMeta: CRDMeta = {
  group: 'terminal.sealos.io',
  version: 'v1',
  namespace: 'terminal-app',
  plural: 'terminals',
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const kubeconfig = await authSession(req.headers)
    const kc = K8sApi(kubeconfig)
    new Error('kube_user get failed')

    const kube_user = kc.getCurrentUser()
    if (!kube_user?.token || !kube_user?.keyData || !kube_user?.certData) {
      new Error('kube_user get failed')
    }

    jsonRes(res, { data: 'sadasds' })
  } catch (error) {
    console.log(error)
    jsonRes(res, { code: 500, error })
  }
}
