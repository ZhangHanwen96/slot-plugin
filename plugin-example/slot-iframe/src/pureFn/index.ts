const fn = () => {
    const delay = new Promise(resolve => {
        window.alert('start pure fn');
        setTimeout(() => {
            resolve(true);
            window.alert('finish pure fn');
        }, 3000);

    })
    return delay;
}

export default fn;