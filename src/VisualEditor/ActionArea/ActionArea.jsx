import React from 'react'
import { IconDownload } from '@tabler/icons-react'
import {
  Group,
  Button,
  Menu,
  ActionIcon,
  rem,
  useMantineTheme,
} from '@mantine/core'
import {
  IconChevronDown,
  IconPoint,
  IconMoodSad,
  IconLoader3,
} from '@tabler/icons-react'

export default function ActionArea({ onLoad, onSave, savedVersions }) {
  const [selectedItem, setSelectedItem] = React.useState(
    'Select To View Previous Versions'
  )
  const theme = useMantineTheme()

  const handleMenuItemClick = (item) => {
    setSelectedItem(item)
  }

  const handleSaveClick = () => {
    const name = prompt('Please enter a name for saved layout:')
    if (name) {
      onSave(name)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <Group style={{ marginLeft: ' auto', marginRight: 'auto' }}>
        <Group wrap='nowrap' gap={1} style={{ marginRight: '30px' }}>
          <Button style={{ width: '290px', textAlign: 'center' }}>
            {selectedItem}
          </Button>
          <Menu
            transitionProps={{ transition: 'pop' }}
            position='bottom-end'
            withinPortal
          >
            <Menu.Target>
              <ActionIcon variant='filled' color={theme.primaryColor} size={36}>
                <IconChevronDown
                  style={{ width: rem(16), height: rem(16) }}
                  stroke={1.5}
                />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {savedVersions.length > 0 ? (
                savedVersions.map((eachVersion) => (
                  <Menu.Item
                    onClick={() =>
                      handleMenuItemClick(`${eachVersion.versionName}`)
                    }
                    leftSection={
                      <IconPoint
                        style={{ width: rem(16), height: rem(16) }}
                        stroke={1.5}
                        color={theme.colors.blue[5]}
                      />
                    }
                  >
                    {eachVersion.versionName}
                  </Menu.Item>
                ))
              ) : (
                <Menu.Item
                  leftSection={
                    <IconMoodSad
                      style={{ width: rem(25), height: rem(25) }}
                      stroke={1.5}
                      color={theme.colors.blue[5]}
                    />
                  }
                >
                  No previous saved version
                </Menu.Item>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Group style={{ marginRight: '20px' }}>
          <Button
            variant='light'
            rightSection={<IconLoader3 stroke={1.5} />}
            radius='sm'
            size='md'
            onClick={() => onLoad(selectedItem)}
          >
            Load Selected Version
          </Button>
        </Group>

        <Button
          variant='light'
          rightSection={<IconDownload stroke={1.5} />}
          radius='sm'
          size='md'
          onClick={handleSaveClick}
        >
          Save Current Layout
        </Button>
      </Group>
    </div>
  )
}
