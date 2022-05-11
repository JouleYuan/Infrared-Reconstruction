import { useEffect, useState } from 'react';

function GetWinSize(){
    const window = document.documentElement;
    const [ size, setSize ] = useState({ width: window.clientWidth, height: window.clientHeight });

    useEffect(() => {
        const onSize = e => {
            setSize({ width: window.clientWidth, height: window.clientHeight });
        };

        window.addEventListener('resize', onSize);

        return () => {
            window.removeEventListener('resize', onSize);
        };
    }, [ window ]);

    return size;
}

export default GetWinSize;