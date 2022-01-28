import React, {
  createRef,
  forwardRef,
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { DialogProps } from '@mui/material'
import HookModal, { HookModalRef } from './modal.hook'
const usePatchElement: () => [
  React.ReactElement[],
  (element: React.ReactElement) => Function
] = () => {
  const [elements, setElements] = useState<React.ReactElement[]>([])
  const patchElement = useCallback((element: React.ReactElement) => {
    setElements((originElements) => [...originElements, element])
    return () => {
      setElements((originElements) =>
        originElements.filter((ele) => ele !== element)
      )
    }
  }, [])
  return [elements, patchElement]
}
let uuid = 0
interface ElementsHolderRef {
  patchElement: ReturnType<typeof usePatchElement>[1]
}
export type modalContentType = (config: Omit<DialogProps, 'open'>) => {
  destroy: () => void
  update: (newConfig: DialogProps) => void
}
const ElementsHolder = memo(
  forwardRef<ElementsHolderRef>((props, ref) => {
    const [elements, patchElement] = usePatchElement()
    useImperativeHandle(
      ref,
      () => ({
        patchElement
      }),
      []
    )
    return <>{elements}</>
  })
)
export function useModal(): [modalContentType, ReactElement] {
  const holderRef = useRef<ElementsHolderRef>(null as any)
  const [actionQueue, setActionQueue] = useState<(() => void)[]>([])
  useEffect(() => {
    if (actionQueue.length) {
      const cloneQueue = [...actionQueue]
      cloneQueue.forEach((action) => {
        action()
      })
      setActionQueue([])
    }
  }, [actionQueue])
  const getModalFunc = useCallback(
    () => (config: Omit<DialogProps, 'open'>) => {
      uuid += 1
      const modalRef = createRef<HookModalRef>()
      let closeFunc: Function
      const modal = (
        <HookModal
          key={`modal-${uuid}`}
          config={config}
          ref={modalRef}
          afterClose={() => {
            closeFunc()
          }}
        />
      )
      closeFunc = holderRef.current?.patchElement(modal)
      return {
        destroy: () => {
          function destroyAction() {
            modalRef.current?.destroy()
          }

          if (modalRef.current) {
            destroyAction()
          } else {
            setActionQueue((prev) => [...prev, destroyAction])
          }
        },
        update: (newConfig: DialogProps) => {
          function updateAction() {
            modalRef.current?.update(newConfig)
          }

          if (modalRef.current) {
            updateAction()
          } else {
            setActionQueue((prev) => [...prev, updateAction])
          }
        }
      }
    },
    []
  )
  const fns = useMemo(() => getModalFunc(), [])
  return [fns, <ElementsHolder ref={holderRef} />]
}
