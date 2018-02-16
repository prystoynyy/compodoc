function Document(target?) {
    return target;
}

class DocumentAction {}

@Document()
export class TestDocument extends DocumentAction {

}