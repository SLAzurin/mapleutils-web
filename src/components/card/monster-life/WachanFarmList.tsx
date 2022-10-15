import {
    Button,
    CircularProgress,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import useCopy from '@hooks/useCopy';
import useWindowDimensions from '@hooks/useWindowDimensions';
import { useState } from 'react';
import { Box } from '@mui/system';
import { Link } from '@components/link';
import { CheckRounded, ContentCopyRounded } from '@mui/icons-material';
import useFetch from '@hooks/useFetch';
import { WACHAN_URL } from '@tools/constants';

interface WachanFarm {
    id: number;
    name: string;
    expiryDate?: Date;
    upVote: number;
    downVote: number;
}

interface WachanFarmListProps {
    name: string;
}

interface WachanFarmListTableProps {
    farms: WachanFarm[];
}

const TRAILING_NOT_VALID_LETTERS = /^([ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]+).*$/;

const WachanFarmListTable = ({ farms }: WachanFarmListTableProps) => {
    const { copy, CopySnackbar } = useCopy();
    const { height } = useWindowDimensions();
    const [checkedList, setCheckedList] = useState<number[]>([]);

    const handleClick = (name: string, index: number) => () => {
        copy(name);
        setCheckedList(prev => [...prev, index]);
    };
    const tableHeight = height - 500;

    return (
        <>
            <TableContainer sx={{ height: tableHeight, maxHeight: tableHeight }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>농장 이름</TableCell>
                            <TableCell align='center'>기간</TableCell>
                            <TableCell align='center'>정확한 정보입니까?</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {farms?.map((f, i) => {
                            const escapedName = f.name.replace(TRAILING_NOT_VALID_LETTERS, (a, b) => b);
                            const isChecked = checkedList.includes(i);
                            return (
                                <TableRow key={f.id} sx={{ cursor: 'pointer' }} hover
                                          onClick={handleClick(escapedName, i)}>
                                    <TableCell sx={theme => ({
                                        width: theme.spacing(20),
                                        maxWidth: theme.spacing(20),
                                        minWidth: theme.spacing(20),
                                    })}>
                                        <Button variant={isChecked ? 'contained' : 'outlined'}
                                                color={'primary'}
                                                startIcon={isChecked ? <CheckRounded /> : <ContentCopyRounded />}>
                                            {isChecked ? '다시복사' : '복사하기'}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant={'h5'}>
                                            {escapedName}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography display='block' align='center' component='span'>
                                            {f.expiryDate?.toLocaleDateString('ko-KR', {
                                                year: '2-digit',
                                                month: 'long',
                                                day: '2-digit',
                                            }) || '무한'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Grid container alignItems='center' spacing={1}>
                                            <Grid item xs={6}>
                                                <Typography fontWeight={'bold'} align='right'>
                                                    {f.upVote - f.downVote}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box display='flex' alignItems='center'>
                                                    ( 👍 {f.upVote} / 👎 {f.downVote} )
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <CopySnackbar />
        </>
    );
};

const WachanFarmList = ({ name }: WachanFarmListProps) => {
    const {
        data: farms,
        isLoading,
        isFinished,
        error,
    } = useFetch<WachanFarm[]>(`/api/wachan?name=${encodeURI(name)}`,
        undefined,
        (data) => data.map(farm => ({ ...farm, expiryDate: farm.expiryDate && new Date(farm.expiryDate) })));

    if (!isFinished || isLoading) {
        return (
            <Stack alignItems={'center'} justifyContent={'center'}>
                <Typography variant={'h6'} component={'div'} gutterBottom>
                    와쨩에서 정보를 불러오는 중입니다. 잠시만 기다려주세요!
                </Typography>
                <CircularProgress />
            </Stack>
        );
    }

    if (error) {
        return <></>;
    }

    if (farms?.length === 0) {
        return <>농장 정보를 찾을 수 없습니다</>;
    }

    return (
        <Paper elevation={0}>
            <Typography gutterBottom variant='h6'>
                해당 자료는{' '}
                <Link rel='noopener noreferrer' target='_blank' href={WACHAN_URL}>
                    와쨩
                </Link>
                에서 제공된 정보입니다. 더욱 높은 정확도를 위해{' '}
                <Link rel='noopener noreferrer' target='_blank' href={WACHAN_URL}>
                    와쨩
                </Link>
                에{' '}
                <Link rel='noopener noreferrer' target='_blank' href={WACHAN_URL}>
                    제보
                </Link>
                해주시면 감사하겠습니다 🥰
            </Typography>
            <WachanFarmListTable farms={farms!} />
        </Paper>
    );
};


export default WachanFarmList;