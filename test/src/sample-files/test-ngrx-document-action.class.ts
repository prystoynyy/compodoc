function _Document(target?) {
    return target;
}

class DocumentAction {}

@_Document()
export class TestDocument extends DocumentAction {

}