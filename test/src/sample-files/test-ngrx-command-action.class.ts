function _Command(target?) {
    return target;
}

class CommandAction {}

@_Command()
export class TestCommand extends CommandAction {

    constructor() {
            super();
    }
}