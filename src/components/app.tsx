import * as React from "react"
import { Component } from "react"
import { writeFileSync, readFileSync } from "fs"
import {
  Window,
  App,
  TextInput,
  Text,
  Menu,
  Box,
  Button,
  Grid
} from "proton-native"
import subscribe from "../subscribe"
import * as WebSocket from "ws"
import { IWebSocketPackage, ICallEvent } from "../types"
import { read } from "clipboardy"

interface IState {
  text: string
  phoneNumber: string
  phoneNumberValid: boolean
  inActiveCall: boolean
}

// tslint:disable:no-magic-numbers

export default class ParrotIt extends Component<{}, IState> {
  private websocketConnection?: WebSocket

  public state = {
    text: "",
    phoneNumber: "",
    phoneNumberValid: false,
    inActiveCall: false
  }

  private async setPhoneNumber(str: string) {
    const phoneNumber = str.replace(/\s/g, "")

    // Validate
    const phoneNumberValid =
      phoneNumber.startsWith("sip:+") &&
      phoneNumber.length > 7 &&
      phoneNumber.length < 50
    this.setState({ phoneNumber, phoneNumberValid })

    console.log(`Phone Number entered: ${phoneNumber}, valid: ${phoneNumberValid}`)
    if (phoneNumberValid) {
      // Remove previous WebSocket Connection
      if (this.websocketConnection) {
        this.websocketConnection.close()
      }

      const ws = await subscribe(phoneNumber)
      ws.on("message", data => {
        console.log(`Received WebSocket Data: ${data}`)
        const { callEvent }: IWebSocketPackage = JSON.parse(data.toString())
        if (callEvent === ICallEvent.CalledNumber) this.setState({ inActiveCall: true })
      })
      ws.on("close", (code, reason) => {
        console.log(`WebSocket Connection closing: ${code} | ${reason}`)
        this.setState({ inActiveCall: false })
      })
      this.websocketConnection = ws
    }
  }

  private async sendToChat() {
    const { text } = this.state
    const ws = this.websocketConnection
    if (!ws) throw new ReferenceError("WebsocketConnection not assigned")
    ws.send(text)
  }

  private async setPhoneNumberFromClipboard() {
    const contents = await read()
    this.setPhoneNumber(contents)
  }

  private async setTextFromClipboard() {
    const contents = await read()
    const { text } = this.state
    this.setState({ text: text + contents })
  }

  public render() {
    const { phoneNumberValid, phoneNumber, text, inActiveCall } = this.state
    return (
      <App onShouldQuit={() => console.log("Quitting")}>
        <Window
          onClose={() => console.log("Closing")}
          title="ParrotIt"
          size={{ w: 500, h: 500 }}
        >
          <Grid padded={true}>
            <Box row={0} column={0} align={{ h: false, v: false }}>
              <Text>Phone Number</Text>
              <TextInput
                onChange={phoneNumberStr => this.setPhoneNumber(phoneNumberStr)}
              >
                {phoneNumber}
              </TextInput>
              <Button onClick={() => this.setPhoneNumberFromClipboard()}>
                Paste
              </Button>
            </Box>
            <Box row={1} column={0} align={{ h: false, v: false }}>
              <Text>Text Input</Text>
              <TextInput
                onChange={text => this.setState({ text })}
                multiline={true}
              >
                {text}
              </TextInput>
              <Button onClick={() => this.setTextFromClipboard()}>
                Paste
              </Button>
            </Box>
            <Box row={2} column={0} align={{ h: false, v: false }}>
              <Button
                enabled={phoneNumberValid && inActiveCall}
                onClick={() => this.sendToChat()}
              >
                ParrotIt
                </Button>
            </Box>
          </Grid>
        </Window>
      </App>
    )
  }
}
