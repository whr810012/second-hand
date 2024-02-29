export const setStorage = (key, data) => {
  return new Promise((resolve, reject) => {
    uni.setStorage({
      key,
      data,
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export const getStorage = async (key) => {
  return new Promise((resolve) => {
    uni.getStorage({
      key,
      success: (res) => {
        console.log(res.data)
        resolve(res.data)
      },
      fail: () => {
        resolve(null)
      }
    })
  })
}

export const removeStorage = (key) => {
  return new Promise((resolve, reject) => {
    uni.removeStorage({
      key,
      fail: (err) => {
        reject(err)
      }
    })
  })
}
