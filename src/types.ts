export interface Options {
    layoutDirs: string | string[]
    extensions: string[]
    exclude: string[]
    defaultLayout: string
    importMode: (name: string) => 'sync' | 'async'
}

export type UserOptions = Partial<Options>

export type FileContainer = {
    path: string
    files: string[]
}
