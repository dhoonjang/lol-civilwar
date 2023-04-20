'use client';
import { User } from '@prisma/client';
import { toast } from 'react-hot-toast';

export default function UpdatePoint() {
  return (
    <button
      className="text-stone-400 hover:text-stone-200 transition-all"
      onClick={async () => {
        const response = await fetch('/api/user', {
          method: 'PATCH',
        });
        const user: User = await response.json();

        toast.success(
          `포인트 업데이트가 완료되었습니다.
[RP: ${user.relationPoint} / BP: ${user.battlePoint}]`
        );
      }}
    >
      포인트 업데이트
    </button>
  );
}
