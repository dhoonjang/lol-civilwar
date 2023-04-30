'use client';

import { Comment, ExternalMatchParticipant } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FormEvent, startTransition, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface CommentFormProps {
  tier: number;
  tierNumber: number;
  matchParticipantId: string;
}

export const CommentForm = ({
  tier,
  tierNumber,
  matchParticipantId,
}: CommentFormProps) => {
  const { refresh } = useRouter();

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const properTier =
        Number(e.currentTarget.tier.value) +
        (5 - Number(e.currentTarget.tierNumber.value)) * 5 -
        13;

      const response = await fetch('/api/comment', {
        method: 'POST',
        body: JSON.stringify({
          matchParticipantId,
          comment: e.currentTarget.comment.value,
          properTier,
        }),
      });
      const comment: Comment = await response.json();

      if (!!comment) toast.success(`댓글이 등록되었습니다.`);

      startTransition(refresh);
    },
    [refresh, matchParticipantId]
  );

  return (
    <form className="card mt-4" onSubmit={handleSubmit}>
      <input
        id="comment"
        type="text"
        placeholder="경기에 대한 한줄평을 입력하세요"
        className="w-full mb-4 border rounded-lg border-gray-500"
      />
      <div className="flex justify-between">
        <div className="flex items-center">
          적정 티어
          <select
            id="tier"
            className="w-28 h-8 border rounded-lg mr-2 ml-4 border-gray-500 text-center"
            defaultValue={tier}
          >
            <option value={10}>아이언</option>
            <option value={30}>브론즈</option>
            <option value={50}>실버</option>
            <option value={70}>골드</option>
            <option value={90}>플래티넘</option>
            <option value={110}>다이아</option>
            <option value={130}>마스터</option>
          </select>
          <select
            id="tierNumber"
            className="w-16 h-8 border rounded-lg font-roman border-gray-500 text-center"
            defaultValue={tierNumber}
          >
            <option value={4}>4</option>
            <option value={3}>3</option>
            <option value={2}>2</option>
            <option value={1}>1</option>
          </select>
        </div>
        <button className="btn btn-blue" type="submit">
          댓글 작성
        </button>
      </div>
    </form>
  );
};
