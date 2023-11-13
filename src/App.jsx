import { MantineProvider } from '@mantine/core'
import VisualEditor from './VisualEditor/VisualEditor'

export default function Demo() {
  return (
    <div style={{ backgroundColor: 'lightgrey', minHeight: '100vh' }}>
      <MantineProvider>
        <VisualEditor />
      </MantineProvider>
    </div>
  )
}
