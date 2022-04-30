const JAVA_HOST = process.env.JAVA_HOST ?? 'localhost';
const JAVA_PORT = Number(process.env.JAVA_PORT ?? 25565);
const QUERY_PORT = Number(process.env.QUERY_PORT ?? 25566);
const BEDROCK_HOST = process.env.BEDROCK_HOST ?? 'localhost';
const BEDROCK_PORT = Number(process.env.BEDROCK_PORT ?? 19132);

import { queryFull, statusBedrock } from "minecraft-server-util"
export enum ServerType {
  BEDROCK,
  JAVA
}
export type MinecraftStatusType = {
  name?: string,
  online: boolean,
  type: ServerType,
  version: string
  players: {
    online: number
    max: number
    list?: string[]
  }
  gameMode?: string
  motd: string
  hostname: string
  port: number,
  time?: string
}

const defaultJavaStatus: MinecraftStatusType = {
  type: ServerType.JAVA,
  name: 'javamc.echobucket.com',
  players: { max: 0, online: 0, list: [] },
  motd: '',
  version: '',
  online: false,
  hostname: JAVA_HOST,
  port: JAVA_PORT
}

export async function getJavaStatus() {
  let java_status: MinecraftStatusType;
  try {
    const java_info = await queryFull(JAVA_HOST, QUERY_PORT);
    java_status = {
      ...defaultJavaStatus,
      online: true,
      version: java_info.version,
      players: java_info.players,
      motd: java_info.motd.clean,
    }
  } catch (e) {
    console.error(e)
    java_status = {
      ...defaultJavaStatus,
      online: false,
      motd: "Server appears to be down",
    }
    return java_status
  }
  return java_status
}

const defaultBedrockStatus: MinecraftStatusType = {
  type: ServerType.BEDROCK,
  name: 'bedrockmc.echobucket.com',
  players: { max: 0, online: 0, list: [] },
  motd: '',
  version: '',
  online: false,
  hostname: BEDROCK_HOST,
  port: BEDROCK_PORT
}

export async function getBedrockStatus() {
  let bedrock_status: MinecraftStatusType
  try {
    const bedrock_response = await statusBedrock(BEDROCK_HOST, BEDROCK_PORT)

    bedrock_status = {
      ...defaultBedrockStatus,
      online: true,
      version: bedrock_response.version.name,
      players: bedrock_response.players,
      gameMode: bedrock_response.gameMode,
      motd: bedrock_response.motd.clean,
    }
  } catch (e) {
    console.error(e)
    bedrock_status = {
      ...defaultBedrockStatus,
      online: false,
      motd: "Server appears to be down",
    }
  }
  return bedrock_status
}