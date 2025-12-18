import PillNotification from "./PillNotification";
import useCanvasStore from "../../store/canvasStore";

export default function NotificationStack() {
  const { notifications, removeNotification } = useCanvasStore();

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {notifications.map((notification) => (
        <PillNotification
          key={notification.id}
          {...notification}
          onDismiss={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}
