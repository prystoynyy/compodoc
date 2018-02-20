function Injectable(target?) {
    return target;
}

function Effect(target?) {
    return target;
}

@Injectable()
export class RootEffects {


    // map from Command INIT_APP to Event APP_INITIALIZED
    // TODO: use computed properties and use enum for them in TypeScript 2.7
    @Effect()
    public INIT_APP;

    // TODO: add SERIALIZE_APP with fake payload

    constructor(private actions$) {
    }

}
