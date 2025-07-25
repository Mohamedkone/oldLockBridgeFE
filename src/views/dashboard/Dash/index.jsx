import { Cloud, Contacts, FileDownload, Web} from '@mui/icons-material';
import { 
  Box,
  Link,
  Typography,
} from '@mui/material';
import { AuthContext } from 'context/AuthContext';
import { useContext, useEffect, useState } from 'react';
import InfoCard from './InfoCard';
import BigCard from './BigCard';
import ActivityTimeline from './ActivityTimeline';
import SiteCard from './SiteCard';
import NewsCard from './NewsCard';
import logo from '../../../assets/images/logo.svg'
import axios from 'axios';



export default function Dashboard() {
  const {setPageTitle} = useContext(AuthContext)
  const {myInfo, api} = useContext(AuthContext)
  const [inteList, setInteList] = useState(null)
  const [liveList, setLiveList] = useState([])
  const [bridgeCount, setBridgeCount] = useState(0)

  useEffect(()=>{
    setPageTitle("Dashboard")
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(()=>{
    if(myInfo){

      axios.get(`${api}/dashboard/count/${myInfo.id}`).then((res)=>{
        setInteList(res.data.integrationBridges)
        setLiveList(res.data.liveBridges)
        setBridgeCount(res.data.count)
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[myInfo])

  const bridges = () =>{
    return(liveList.map((x,i)=>{
      const trimExp = x.exp.split("T")[0]
      return(
      <Box key={i}
      display={'flex'}
      justifyContent={'space-between'}
      alignItems={'center'}
      borderBottom={i===(liveList.length-1)?"0px":"1px solid #ccc"}
      px={3}
      py={1}
      gap={1}
      overflow={'auto'}
      >
        <Typography width={"10ch"}>{trimExp}</Typography>
        <Typography flexGrow={1} fontWeight={"bold"}>{x.alias}</Typography>
        <Link 
          href={`http://localhost:3000/livebridge?panel=Live&${x.id}`}
          color='primary'
          >
          View
        </Link>
      </Box>
        )})
    )
  }


  return (
    <Box 
      display={"flex"} flexDirection={'column'} 
      gap={10} style={{ width: '100%' }}
    >
      <Box display={'flex'} flexWrap={'wrap'} gap={5} justifyContent={'center'}>
        <InfoCard 
          mainIcon={Cloud} textColor={"#042174"} 
          bgColor={"#D2EAFD"} bigText={"916GB"} 
          caption={"Storage left"}
        />
        <InfoCard 
          mainIcon={Contacts} textColor={"#9548F2"} 
          bgColor={"#EED8FF"} bigText={bridgeCount} 
          caption={"Active bridges"}
        />
        <InfoCard 
          mainIcon={FileDownload} textColor={"#EE6041"} 
          bgColor={"#FFE9DB"} bigText={"0"}
          caption={"File(s) received"}
        />
      </Box>
      <Box 
        display={'flex'} flexDirection={'column'} gap={5} p={"0 10px"}
      >
        <Box 
          display={'flex'} gap={5}
          flexWrap={"wrap"} justifyContent={'center'}
        >
          <BigCard 
            width={"min(90dvw, 400px)"} 
            maxHeight={"250px"}
            minHeight={"200px"}
            title={"Active Live Bridges"}
            link={'/bridge?panel=Live'}
          >
            <Box py={2}>
            <Box
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              borderBottom={"1px solid #ccc"}
              px={2}
              gap={1}
              >
                <Typography fontWeight={"bold"} width={"10ch"}>Expire In</Typography>
                <Typography flexGrow={1} fontWeight={"bold"}>Name</Typography>
                <Typography fontWeight={"bold"}>Action</Typography>
            </Box>
              {bridges()}
            </Box>
          </BigCard>
          <BigCard
            width={"min(90dvw, 500px)"}
            minHeight={"200px"}
            maxHeight={"420px"}
            title={"Recent activity"}
          >
            <Box
            className="blur-bottom"
            
            >

            <Box 
            sx={{
              overflowY:"auto",
              maxHeight:"320px"
            }}>
              <ActivityTimeline />
            </Box>
                </Box>
          </BigCard>
        </Box>
        <Box 
          display={'flex'} gap={5} p={"0 10px"}
          flexWrap={"wrap"} justifyContent={'center'}
        >
        <BigCard
          width={"min(90dvw, 500px)"}
          minHeight={"200px"}
          maxHeight={"420px"}
          title={"Active integrations"}
          link={'/bridge?panel=Integration'}
        >
          <Box 
            display={'grid'}
            gridTemplateColumns={"1fr 1fr"}
            maxHeight={"300px"}
            justifyItems={'center'}
            gap={5}
            sx={{overflowY:"auto"}}
            py={2}
          >
            {inteList?.map((x,i)=>(
              <SiteCard key={i} cName={x.host} cIcon={Web} cColor={'error'} status={x.status}/>
            ))}
          </Box>
        </BigCard>
        <BigCard
        width={"min(90dvw, 500px)"}
        minHeight={"200px"}
        maxHeight={"420px"}
        title={"Data breaches news"}
        >
          <Box 
            maxHeight={"330px"}
            sx={{overflowY:"auto"}}
          >
            <NewsCard 
            thumbnail={logo} 
            title={"30000 databse breached"} 
            desc={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, pariatur atque esse laudantium aut a quis veritatis architecto dignissimos porro!"}
            date={"Today"}
            />
            <NewsCard 
            thumbnail={logo} 
            title={"30000 databse breached"} 
            desc={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, pariatur atque esse laudantium aut a quis veritatis architecto dignissimos porro!"}
            date={"Today"}
            />
            <NewsCard 
            thumbnail={logo} 
            title={"30000 databse breached"} 
            desc={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, pariatur atque esse laudantium aut a quis veritatis architecto dignissimos porro!"}
            date={"Today"}
            />
            <NewsCard 
            thumbnail={logo} 
            title={"30000 databse breached"} 
            desc={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, pariatur atque esse laudantium aut a quis veritatis architecto dignissimos porro!"}
            date={"Today"}
            />
            <NewsCard 
            thumbnail={logo} 
            title={"30000 databse breached"} 
            desc={"Lorem ipsum dolor sit, amet consectetur adipisicing elit. Delectus, pariatur atque esse laudantium aut a quis veritatis architecto dignissimos porro!"}
            date={"Today"}
            />
          </Box>
        </BigCard>
        </Box>
      </Box>
    </Box>
  );
}
