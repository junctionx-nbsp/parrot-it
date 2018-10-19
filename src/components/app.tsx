import * as React from "react"
import { Component } from "react"
import { writeFileSync, readFileSync } from "fs"
import {
  Window,
  App,
  TextInput,
  Dialog,
  Menu,
  Box,
} from "proton-native"

interface IState {
  text: string | Buffer
}

export default class Notepad extends Component<{}, IState> {
  public state = { text: "" }

  private save() {
    const filename = Dialog("Save")
    if (filename) {
      writeFileSync(filename, this.state.text)
    }
  }

  private open() {
    const filename = Dialog("Open")
    if (filename) {
      const data = readFileSync(filename)
      this.setState({ text: data })
    }
  }

  public shouldComponentUpdate(nextProps: {}, nextState: IState) {
    if (typeof nextState.text === "string")
      return false // nextState is set from input
    else return true // nextState is set from file
  }

  public render() {
    return (
      <App onShouldQuit={() => console.log("Quitting")}>
        <Menu label="File">
          <Menu.Item type="Item" onClick={() => this.open()}>
            Open
          </Menu.Item>
          <Menu.Item type="Item" onClick={() => this.save()}>
            Save
          </Menu.Item>
          <Menu.Item type="Quit" />
        </Menu>
        <Window
          onClose={() => console.log("Closing")}
          title="Notes"
          size={{ w: 500, h: 500 }}
        >
          <Box>
            <TextInput
              onChange={text => this.setState({ text })}
              multiline={true}
            >
              {this.state.text}
            </TextInput>
          </Box>
        </Window>
      </App>
    )
  }
}
