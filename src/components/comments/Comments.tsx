'use client';

import { Card } from '@/ds/surfaces';
import { Tooltip, Typography } from '@/ds/displays';
import { CommentList } from '@/components/comments/CommentList';
import { Fragment, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from '@/i18n/client';
import { RiChat1Fill } from 'react-icons/ri';
import { CommentPostForm } from '@/components/comments/CommentPostForm';
import { Widget } from '@/ds/surfaces/widget/Widget';
import { Button } from '@/ds/inputs';
import useAnimationState from '@/hooks/useAnimationState';

interface CommentsProps {
}

export const Comments = ({}: CommentsProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const { state, open } = useAnimationState(125);

    return (
        <Container ref={ref}>
            <Typography as={'h2'} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <RiChat1Fill /> {t('comment.comment')} {0}
            </Typography>
            <Hr />
            <CommentPostForm />
            <CommentList>
            </CommentList>
            <Widget>
                <Tooltip title={t('comment.comment')} size={'small'} placement={'left'}>
                    <Button size={'large'} data-state={state} onClick={() => {
                        ref.current?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                    }}>
                        <RiChat1Fill /> {0}
                    </Button>
                </Tooltip>
            </Widget>
        </Container>
    );
};

const Hr = styled.hr`
  margin-bottom: 4px;
`;

const Container = styled(Card).attrs({ as: 'aside' })`
  grid-area: comments;
  width: 100%;
  scroll-margin-top: calc(${({ theme }) => theme.appBar.height} + 16px);
`;
