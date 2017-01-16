
export const ResourceLoader = () => {
    const _loadingMan = new THREE.LoadingManager()
    const _onProgress = (xhr) => {

    }

    return {
        loadResource: (path) => {
            console.log('Resource loader: will load at path: ' + path)
            const ext = path.substring(path.length - 3)
            let promise;
            switch (ext) {
                case 'obj':
                    promise = new Promise((resolve, reject) => {
                        const loader = new THREE.OBJLoader(_loadingMan)
                        loader.load(path, resolve, _onProgress, reject)
                    })
                break
                case 'png':
                    promise = new Promise((resolve, reject) => {
                        const loader = new THREE.TextureLoader(_loadingMan)
                        loader.load(path, resolve, _onProgress, reject)
                    })
                break
                default:
                    promise = new Promise((resolve, reject) => {
                        reject('Resource loader: no support for extension ' + ext)
                    })
            }
            return promise
        }
    }
}