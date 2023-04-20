import Iconfont from '@/components/iconfont'
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import styles from './index.module.scss'
import { nanoid } from 'nanoid'
import { debounce } from 'lodash'

type Terminal = {
  id: string
  command?: string
}

function Terminal({ url }: { url: string }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tabId, setTabId] = useState(nanoid(6))

  const [tabContents, setTabContents] = useState<Terminal[]>([
    {
      id: tabId,
    },
  ])

  useEffect(() => {
    try {
      window.addEventListener('message', (e) => {
        if (e.data.type === 'new terminal' && e.data.command) {
          newTerminal(e.data.command)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }, [])

  const onLoadIframe = (e: any, item: Terminal) => {
    try {
      if (item.command) {
        setTimeout(() => {
          e.target.contentWindow.postMessage({ command: item.command }, '*')
        }, 2000)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const newTerminal = (command?: string) => {
    const temp = nanoid(6)
    setTabContents((pre) => {
      return [
        ...pre,
        {
          id: temp,
          command: command,
        },
      ]
    })
    setTabId(temp)
  }

  const deleteTerminal = (key: string) => {
    if (tabContents.length <= 1) return
    setTabContents((pre) => {
      const temp = pre.filter((item) => item.id !== key)
      setTabId(temp[temp.length - 1].id)
      return temp
    })
  }

  const onTabChange = (id: string) => {
    setTabId(id)
  }

  return (
    <Flex w="100%" h="100%" color="white" bg="#2b2b2b" overflow={'hidden'}>
      <Flex
        flexDirection={'column'}
        cursor={'pointer'}
        className={styles.containerLeft}>
        <Flex
          flexShrink={0}
          h="50px"
          pl="16px"
          alignItems={'center'}
          textAlign="left"
          borderBottom={'2px solid #232528'}
          onClick={debounce(() => newTerminal(), 500)}>
          Add a Terminal
        </Flex>
        <Box overflowX={'hidden'} overflowY="auto" pb="20px">
          {tabContents?.map((item: Terminal, index: number) => {
            return (
              <Flex
                py="12px"
                pl="16px"
                pr="18px"
                bg={item?.id === tabId ? '#232528' : ''}
                key={item?.id}
                alignItems="center"
                justifyContent="space-between"
                onClick={() => onTabChange(item?.id)}
                className={styles.tabs}
                data-isactive={item?.id === tabId}>
                <Text isTruncated color="#FFFFFF">
                  {`terminal-${item?.id}`}
                </Text>
                <Box
                  className={styles.closeIcon}
                  onClick={() => deleteTerminal(item?.id)}>
                  <Iconfont
                    iconName="icon-notion-cancel"
                    color="#c5c5c5"
                    width={16}
                    height={16}></Iconfont>
                </Box>
              </Flex>
            )
          })}
        </Box>
      </Flex>

      <Drawer onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {tabContents?.map((item: Terminal) => {
        return (
          <Box
            flexGrow={1}
            key={item?.id}
            display={item?.id === tabId ? 'block' : 'none'}>
            <iframe
              onLoad={(e) => onLoadIframe(e, item)}
              className={styles.iframeWindow}
              id={tabId}
              src={url}
              allow="camera;microphone;clipboard-write;"
            />
          </Box>
        )
      })}
    </Flex>
  )
}

export default Terminal
