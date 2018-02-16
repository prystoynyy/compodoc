function Event(target?) {
    return target;
}

class EventAction {}

@Event()
export class TestLoadEvent extends EventAction {

}