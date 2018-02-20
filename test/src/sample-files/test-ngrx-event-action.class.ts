function _Event(target?) {
    return target;
}

class EventAction {}

@_Event()
export class TestLoadEvent extends EventAction {

}