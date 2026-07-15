import SchemeForm from '@/components/admin/SchemeForm';

export default function EditSchemePage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">✏️ Yojana Edit Karo</h2>
        <p className="text-sm text-gray-500 mt-1">
          Koi bhi jankari change karo aur &quot;Update Karo&quot; dabao.
        </p>
      </div>
      <SchemeForm schemeId={params.id} />
    </div>
  );
}
