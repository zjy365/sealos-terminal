import * as yaml from 'js-yaml'

type terminalStatus = {
  availableReplicas: number
  domain?: string
}

type TerminalForm = {
  username: string
  token: string
  namespace: string
  currentTime: string
}

// this template is suite for golang(kubernetes and sealos)'s template engine
const generateTerminalTemplate = (form: TerminalForm) => {
  const temp = {
    apiVersion: 'terminal.sealos.io/v1',
    kind: 'Terminal',
    metadata: {
      name: `terminal-${form.username}`,
      namespace: form.namespace,
      annotations: {
        lastUpdateTime: form.currentTime,
      },
    },
    spec: {
      user: form.username,
      token: form.token,
      apiServer: 'https://kubernetes.default.svc.cluster.local:443',
      ttyImage: 'hub.sealos.cn/labring/terminal-app:1.19.4',
      replicas: 1,
      keepalived: '4h',
    },
  }

  try {
    const result = yaml.dump(temp)
    return result
  } catch (error) {
    return null
  }
}
