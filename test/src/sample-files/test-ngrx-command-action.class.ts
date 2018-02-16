function Command(target?) {
    return target;
}

class CommandAction {}

@Command()
export class TestCommand extends CommandAction {

    constructor() {
            super();
    }
}