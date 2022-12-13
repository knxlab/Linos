import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useArtist from '../../../hooks/useArtist';
import { useNavigate } from 'react-router-dom';
import { Chip } from '@mui/material';
import useFanTokenBalance from '../../../hooks/useFanTokenBalance';
import useCurrentAccount from '../../../hooks/useCurrentAccount';

import img1 from "../../../assets/artists/1.jpeg";
import img2 from "../../../assets/artists/2.jpeg";
import img3 from "../../../assets/artists/3.jpeg";
import img4 from "../../../assets/artists/4.jpeg";
import img5 from "../../../assets/artists/5.jpeg";
import img6 from "../../../assets/artists/6.jpeg";
import img7 from "../../../assets/artists/7.jpeg";

const imgs = [img1, img2, img3, img4, img5, img6, img7]

export default function ArtistCard({ artistAddress, className }: { artistAddress: string; className: string }) {

  const imgIdRef = React.useRef(Math.random() * 7);
  const account = useCurrentAccount();
  const {artist} = useArtist({ address: artistAddress });
  const { fanTokenBalance, symbol, refresh } = useFanTokenBalance({ fanTokenAddress: artist.fanTokenAddress, account });
  const navigate = useNavigate();

  const imgId = parseInt(artistAddress[artistAddress.length - 1], 16) % 7;
  console.log("imgId", imgId);

  const imgSrc = imgs[imgId];

  const goToArtistPage = async () => {
    navigate("/marketplace/artist/" + artistAddress)
  }
  return (
    <Card sx={{ maxWidth: 345 }} className={className}>
      <CardMedia
        component="img"
        height="140"
        image={imgSrc}
        alt="artist"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {artist.name}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={goToArtistPage}>Go to artist page</Button>
        <Chip label={`${fanTokenBalance} ${symbol}`} style={{marginRight: '10px'}} />
      </CardActions>
    </Card>
  );
}