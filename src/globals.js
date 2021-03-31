const canvas = document.querySelector('canvas')

export const CTX = canvas.getContext('2d')
export const { width: WIDTH, height: HEIGHT } = canvas

export const SPRITE = new Image()
SPRITE.src = 'src/assets/0x72_DungeonTilesetII_v1.3.png'

export const TILE_SIZE = 16
