function detectFetchMethod() {
    if ((window as any).axios) {
        return "axios";
    }

    if ((window as any).fetch){
        return "fetch";
    }

    return "none";
}

export default detectFetchMethod;