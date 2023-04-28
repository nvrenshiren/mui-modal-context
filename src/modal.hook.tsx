import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState
} from 'react'
import { DialogProps, Dialog } from '@mui/material'

export interface HookModalProps {
  config: Omit<DialogProps, 'open'>
  afterClose: () => void
}
export interface HookModalRef {
  destroy: () => void
  update: (config: Omit<DialogProps, 'open'>) => void
}
const HookModal: React.ForwardRefRenderFunction<
  HookModalRef,
  HookModalProps
> = ({ config, afterClose }, ref) => {
  const [visible, setVisible] = useState(true)
  const [innerConfig, setInnerConfig] = useState(config)

  const close = useCallback(() => {
    const endTime =
      typeof innerConfig.transitionDuration === 'number'
        ? innerConfig.transitionDuration
        : innerConfig.transitionDuration?.exit || 0
    setVisible(false)
    setTimeout(() => {
      !!afterClose && afterClose()
    }, endTime)
  }, [afterClose, innerConfig])
  useImperativeHandle(ref, () => ({
    destroy: close,
    update: (newConfig: Omit<DialogProps, 'open'>) => {
      setInnerConfig((originConfig) => ({
        ...originConfig,
        ...newConfig
      }))
    }
  }))

  return (
    <Dialog
      {...innerConfig}
      onClose={innerConfig.onClose || close}
      open={visible}
    />
  )
}

export default forwardRef(HookModal)
