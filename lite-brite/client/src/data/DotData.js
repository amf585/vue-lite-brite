import ColorConstants from './constants';

export default class DotData {
    constructor(id) {
        this.id = id;
        this.on = false;
        this.color = ColorConstants.DEFAULT_COLOR_OFF;
    }
}