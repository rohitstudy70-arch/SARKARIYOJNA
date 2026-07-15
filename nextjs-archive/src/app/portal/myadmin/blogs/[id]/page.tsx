import GenericForm from '@/components/admin/blogsForm';
export default function EditPage({ params }: { params: { id: string } }) { return ( <div className="max-w-5xl"><h2 className="text-2xl font-bold mb-6">Edit</h2><GenericForm itemId={params.id} /></div> ) }
