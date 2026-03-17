import type { Comment } from '../types'

interface Props {
  comments: Comment[]
}

// TODO (estudiante): implementar formateo de fecha
// Opciones:
//   - new Date(comment.createdAt).toLocaleString('es-AR')
//   - Formato relativo: "hace 2 horas" usando Date.now() - new Date(comment.createdAt).getTime()
//   - Librería: date-fns formatDistanceToNow(new Date(comment.createdAt), { locale: es })
function formatDate(_dateStr: string): string {
  // TODO (estudiante): reemplazar esta línea con el formateo real de la fecha
  return _dateStr
}

export default function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return <p className="text-sm text-gray-500">No hay comentarios todavía.</p>
  }

  return (
    <ul data-testid="comment-list" className="space-y-3">
      {comments.map((comment) => (
        <li
          key={comment.id}
          data-testid="comment-item"
          className="bg-gray-50 border border-gray-200 rounded-lg p-3"
        >
          <p className="text-sm text-gray-800">{comment.body}</p>
          <p className="text-xs text-gray-400 mt-1">
            {/* TODO (estudiante): usar formatDate(comment.createdAt) cuando esté implementado */}
            {formatDate(comment.createdAt)}
          </p>
        </li>
      ))}
    </ul>
  )
}
