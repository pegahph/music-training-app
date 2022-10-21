import { Card, CardContent } from "@mui/material";

const Wrapper = ({children}) => {
  return (
    <Card sx={{m: 2, height: 'calc(100% - 96px)', backgroundColor: '#ffffffe8', boxShadow: '0px 0px 9px -2px blue'}}>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default Wrapper;
