/* eslint-disable react-hooks/exhaustive-deps */
import TransfersGrid from './TransfersGrid';

export default function PeerLogs({data}) {

  const columns = [
    { field: 'email', headerName: 'Email', width: 250,  sortable: true},
    { field: 'filename', headerName: 'File Name', width: 250,  sortable: true },
    { field: 'size', headerName: 'Size', width: 130,  sortable: true },
    { field: 'type', headerName: 'Type', width: 130 },
    { field: 'date', headerName: 'Date', width: 130,  sortable: true },
    {
      field: 'received', headerName: 'Received', width: 100, scrollY: true, 
    },
    {
      field: 'receiver', headerName: 'Receiver', width: 200, sortable: false,
    },

  ];

  return (
    <div style={{ width: '100%' }}>
      <TransfersGrid rows={data} columns={columns} isVault={false}/>
    </div>
  );
}
