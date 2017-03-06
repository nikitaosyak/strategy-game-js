export const ResourceLoaderConstructor = () => {
    const _loadingManager = new THREE.LoadingManager()
    const _onProgress = (xhr) => {}

    return {
        load: (path) => {
            // console.log('Resource loader: will load at path: ' + path)
            const pathArr = path.split('.')
            const ext = pathArr[pathArr.length - 1]
            let promise;
            switch (ext) {
                case 'json':
                    promise = new Promise((resolve, reject) => {
                        var req = new XMLHttpRequest()
                        req.addEventListener('error', reject)
                        req.addEventListener('abort', reject)
                        req.open('GET', path)
                        req.onreadystatechange = () => {
                            if (req.readyState === 4 && req.status === 200) {
                                resolve(JSON.parse(req.responseText))
                            }
                        }
                        req.send()
                    })
                break
                case 'obj':
                    promise = new Promise((resolve, reject) => {
                        const loader = new THREE.OBJLoader(_loadingManager)
                        loader.load(path, resolve, _onProgress, reject)
                    })
                break
                case 'png':
                    promise = new Promise((resolve, reject) => {
                        const loader = new THREE.TextureLoader(_loadingManager)
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