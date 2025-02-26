import {createSlicer} from '@reduxjs/toolkit'
interface State {
	boards : Board[]
}
const boardSlicer = createSlicer({
	name: "boardSlicer",

})
