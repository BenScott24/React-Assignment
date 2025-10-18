 const processAndPlay = (text) => {
        try {
            const processed = processText(text);
            if(editorRef.current) {
                editorRef.current.setCode(processed);
                setTimeout(() => { editorRef.current.evaluate(); }, 150);
            }
        } catch (error) {
            console.error(error);
            setAlert?.({ type: 'danger', text: 'Processing and playback failed.'});
        }
    };

    const processAndPlay = (text) => {
        try {
            const processed = processText(text);
            if(editorRef.current) {
                editorRef.current.setCode(processed);
                setTimeout(() => { editorRef.current.evaluate(); }, 150);
            }
        } catch (error) {
            console.error(error);
            setAlert?.({ type: 'danger', text: 'Processing and playback failed.'});
        }
    };

    const play = () => {
        try {
            editorRef.current?.evaluate();
        } catch (error) {
            console.error(error);
            setAlert?.({ type: 'danger', text: 'Playback failed.'});
        }
    };

    const stop = () => {
        try {
            editorRef.current?.stop();
        } catch (error) {
            console.error(error);
            setAlert?.({ type: 'danger', text: 'Stop failed.'});
        }
    };

    