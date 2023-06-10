export const styles = {   
    mainContainer: {
        flex: 2.2 
    },
    cameraContainer: {
	    flex: 1,
	    flexDirection: 'row'
    },
    audioContainer: {
        flex: -1,
        alignItems: 'center',
        alignSelf: 'center'
    },
    progressText: {
        alignSelf: 'center',
        marginBottom: '8%',
        marginTop: '8%'
    },
    fixedRatio: {
		flex: 1,
		aspectRatio: 1
	},
    outputContainer: {
        fontSize: '100%',
        maxHeight: '50%',
        minHeight: '50%',
        alignSelf: 'center',
        borderWidth: 3,
        width: '90%',
        padding: '3%',
        position: 'fixed',
        marginBottom: '-65%',
        borderRadius: '5px',
        borderColor: '#aabbcc'
    },
    primaryButton: {
        width: '50%',
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 22,
        // borderRadius: 4,
        elevation: 3,
        backgroundColor: '#081d41', 
    },
    secondaryButton: {
        width: '50%',
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 22,
        // borderRadius: 4,
        elevation: 3,
        backgroundColor: '#0de668', 
    },
    searchButton: {
        width: '100%',
        height: 65,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 22,
        // borderRadius: 4,
        elevation: 3,
        backgroundColor: '#fdbb30',
    },
    clearButton: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 32,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: '#c1b9b4',
    },
    audioButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },

}

