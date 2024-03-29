import 'styled-components'
import { defaulTheme } from '../styles/themes/defaut'

type ThemeType = typeof defaulTheme

declare module 'styled-components' {
  export interface DefaulTheme extends ThemeType {}
}
