import {React, useState, useEffect} from 'react';
import { firebaseApp } from '../firebaseconfig';
import { getStorage, ref, getDownloadURL, list } from 'firebase/storage';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Container } from 'react-bootstrap';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ResponsiveAppBar from '../components/ResponsiveAppBar';


function Wedding() {
    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPage, setNextPage] = useState(null);

    const storage = getStorage(firebaseApp);
    const pathReference = ref(storage, 'gs://weddingpictures-a5e0e.appspot.com/marriage');
  
    useEffect
    (() => {
    
    list(pathReference, { maxResults: 12})
        .then((result) => {
            console.log(result);
            if(result.nextPageToken) {
                setNextPage(result.nextPageToken)
            } else {
                setNextPage(null)
            }
            result.items.forEach((item) => {
                getDownloadURL(item)
                .then((url) => {
                    setPictures((pictures) => [...pictures, url]);
                })
                .catch((e) => {
                    console.log(e);
                })
            })
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
          setLoading(false);
        })

        console.log(pictures)

        return () => {
          setPictures([])
          setLoading(true);
          setNextPage(null);
        }
  }, [])

  const getPictures = () => {
    setPictures([]);
    setNextPage(null);
    setLoading(true);
    list(pathReference, { maxResults: 12, pageToken: nextPage})
        .then((result) => {
            console.log(result);
            if(result.nextPageToken) {
                setNextPage(result.nextPageToken)
            } else {
                setNextPage(null)
            }
            result.items.forEach((item) => {
                getDownloadURL(item)
                .then((url) => {
                    setPictures((pictures) => [...pictures, url]);
                })
                .catch((e) => {
                    console.log(e);
                })
            })
            
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(() => {
          setLoading(false);
        })

        console.log(pictures)

        return () => {
          setPictures([])
        }
  }

  return (
    <>
        <ResponsiveAppBar />
        {/* <AppBar position="sticky">
            <Toolbar>
            <Typography variant="h6" color="inherit" noWrap>
                Jaskaran Weds Amrit
            </Typography>
            </Toolbar>
        </AppBar> */}
        <Container maxWidth="sm" style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
            {loading ? <CircularProgress /> : (

            <ImageList variant="masonry" cols={3} gap={8}>
                {pictures.map((item, index) => (
                <ImageListItem key={index}>
                    <img
                    src={`${item}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    alt='wedding'
                    loading="lazy"
                    />
                </ImageListItem>
                ))}
            </ImageList>

            )}

            {nextPage && <Button variant="outlined" onClick={getPictures}>Next Page</Button>}

        </Container>
    </>
  );
}

export default Wedding