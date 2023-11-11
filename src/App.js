import { MantineProvider } from '@mantine/core';
import VisualEditor from './VisualEditor/VisualEditor';


export default function Demo() {
  return (
    <MantineProvider>
      <VisualEditor />
    </MantineProvider>
  );
}