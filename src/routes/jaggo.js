import {React, useState, useEffect} from 'react';
import { firebaseApp } from '../firebaseconfig';
import { getStorage, ref, getDownloadURL, list } from 'firebase/storage';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Container } from 'react-bootstrap';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import Stack from '@mui/material/Stack'


function Jaggo() {

    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPage, setNextPage] = useState(null);
    const [isPrevPage, setisPrevPage] = useState(false);
    const pages = new Set();

    const storage = getStorage(firebaseApp);
    const pathReference = ref(storage, 'gs://weddingpictures-a5e0e.appspot.com/jaggo');

    async function getFirstFewPictures() {

        try {
            setLoading(true);
            const result = await list(pathReference, {maxResults: 12, pageToken: nextPage});
            if(result.nextPageToken) {
                setNextPage(result.nextPageToken);
                pages.add(result.nextPageToken);
            } else {
                setNextPage(null);
            }
            for (const item of result.items) {
                let url = await getDownloadURL(item);
                setPictures((pictures) => [...pictures, url]);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
            console.log(pages)
        }
        
    }

    useEffect(() => {

        getFirstFewPictures();

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
    setisPrevPage(true);

    getFirstFewPictures();

    console.log(pictures)
  }

  const goBackOnePage = () => {
    console.log('inside go back one page')
    setPictures([]);
    setNextPage(null);
    setLoading(true);
    pages.;
    console.log(pages.length)

    if(pages.length === 0) { 
        setisPrevPage(false)
        list(pathReference, { maxResults: 12})
        .then((result) => {
            console.log(result);
            if(result.nextPageToken) {
                setNextPage(result.nextPageToken)
                pages.push(result.nextPageToken);
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
        } else {
            list(pathReference, { maxResults: 12, pageToken: pages[pages.length - 1]})
            .then((result) => {
                console.log(result);
                if(result.nextPageToken) {
                    setNextPage(result.nextPageToken)
                    pages.push(result.nextPageToken);
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
                    alt='jaggo'
                    loading="lazy"
                    />
                </ImageListItem>
                ))}
            </ImageList>

            )}

            <Stack>
            {isPrevPage && <Button variant="outlined" onClick={goBackOnePage}>Back</Button>}
            {nextPage && <Button variant="outlined" onClick={getPictures}>Next Page</Button>}
            </Stack>
            

        </Container>
    </>
  );
}

export default Jaggo