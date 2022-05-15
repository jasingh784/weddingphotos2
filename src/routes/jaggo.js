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
import AWS  from 'aws-sdk';
import config from '../config.json';


function Jaggo() {
    const [pictures, setPictures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [nextPage, setNextPage] = useState(null);

    const [windowDimenion, setWindowDimenion] = useState({
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
    })

    const detectSize = () => {
        setWindowDimenion({
            winWidth: window.innerWidth,
            winHeight: window.innerHeight,
        })
    }

    const storage = getStorage(firebaseApp);
    const pathReference = ref(storage, 'gs://weddingpictures-a5e0e.appspot.com/jaggo');

    async function getPicturesFromFirebase() {

        try {
            setLoading(true);
            setPictures([]);
            const result = await list(pathReference, {maxResults: 25, pageToken: nextPage});
            console.log(result)
            if(result.nextPageToken) {
                setNextPage(result.nextPageToken);
            } else {
                setNextPage(null);
            }
            for (const item of result.items) {
                let url = await getDownloadURL(item);
                console.log(url)
                if(!pictures.includes(url)) {
                    console.log('not included')
                    setPictures((pictures) => [...pictures, url]);
                } else {
                    console.log('included')
                }
                
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
        
    }

    async function getPicturesFromS3() {
        try {
           
           // AWS.config.setPromisesDependency();
            AWS.config.update({
                accessKeyId: process.env.accessKey,
                secretAccessKey: process.env.secretKey,
            })
            
            const s3 = new AWS.S3({
                param: {Bucket: 'jasandamrit'},
                region: 'us-west-1'
            });
            const response = await s3.listObjectsV2({
                Bucket: 'jasandamrit',
                Prefix: "jaggo",
                MaxKeys: 25,
                ContinuationToken: nextPage
            })

            const content = await response.promise();

            console.log('s3 content', content)
            if(content.NextContinuationToken) {
                setNextPage(content.NextContinuationToken);
            } else (
                setNextPage(null)
            )
            //oh boy. This is a mess
            for(const item in content.Contents) {
                
                if(!pictures.includes(content.Contents[item].Key)) {
                    setPictures((pictures) => [...pictures, content.Contents[item].Key]);
                }
               
            }
            
            
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
        
        
    }

    useEffect(() => {
        
        //getPicturesFromFirebase();

        getPicturesFromS3();

  }, [])

  useEffect(() => {
    window.addEventListener('resize', detectSize);
  
    return () => {
      window.removeEventListener('resize', detectSize);
    }
  }, [windowDimenion])
  

  const getNextPictures = () => {
    setPictures([]);
    setLoading(true);
    

    //getFirstFewPictures();
    getPicturesFromS3();
  }

//   const goBackOnePage = () => {
//     console.log('inside go back one page')
//     setPictures([]);
//     setNextPage(null);
//     setLoading(true);
//     console.log(pages.length)

//     if(pages.length === 0) { 
//         setisPrevPage(false)
//         list(pathReference, { maxResults: 12})
//         .then((result) => {
//             console.log(result);
//             if(result.nextPageToken) {
//                 setNextPage(result.nextPageToken)
//                 pages.push(result.nextPageToken);
//             } else {
//                 setNextPage(null)
//             }
//             result.items.forEach((item) => {
//                 getDownloadURL(item)
//                 .then((url) => {
//                     setPictures((pictures) => [...pictures, url]);
//                 })
//                 .catch((e) => {
//                     console.log(e);
//                 })
//             })
            
//         })
//         .catch((error) => {
//             console.log(error)
//         })
//         .finally(() => {
//           setLoading(false);
//         })
//         } else {
//             list(pathReference, { maxResults: 12, pageToken: pages[pages.length - 1]})
//             .then((result) => {
//                 console.log(result);
//                 if(result.nextPageToken) {
//                     setNextPage(result.nextPageToken)
//                     pages.push(result.nextPageToken);
//                 } else {
//                     setNextPage(null)
//                 }
//                 result.items.forEach((item) => {
//                     getDownloadURL(item)
//                     .then((url) => {
//                         setPictures((pictures) => [...pictures, url]);
//                     })
//                     .catch((e) => {
//                         console.log(e);
//                     })
//                 })
                
//             })
//             .catch((error) => {
//                 console.log(error)
//             })
//             .finally(() => {
//             setLoading(false);
//             })
//         }


//   }

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

            <ImageList variant="masonry" cols={windowDimenion.winWidth <= 650 ? 1 : 3} gap={8}>
                {pictures.map((item, index) => (
                <a href={`https://jasandamrit.s3.us-west-1.amazonaws.com/${item}`} target="_blank" rel="noreferrer" key={index}>
                <ImageListItem key={index}>
                    
                        <img
                        src={`https://jasandamrit.s3.us-west-1.amazonaws.com/${item}?w=164&h=164&fit=crop&auto=format`}
                        alt='jaggo'
                        loading="lazy"
                        key={index}
                        />
                    
                </ImageListItem>
                </a>
                ))}
            </ImageList>

            )}

            <Stack>
            {/* {isPrevPage && <Button variant="outlined" onClick={goBackOnePage}>Back</Button>} */}
            {nextPage && <Button variant="outlined" onClick={getNextPictures}>Next Page</Button>}
            </Stack>
            

        </Container>
    </>
  );
}

export default Jaggo
