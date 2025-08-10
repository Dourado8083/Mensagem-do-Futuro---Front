"use client";

import React, { useState, useEffect } from "react";
import {
  Send,
  Clock,
  Mail,
  MessageSquare,
  Calendar,
  Check,
  Trash2,
} from "lucide-react";

export default function ScheduledMessageApp() {
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [scheduledDate, setScheduledDate] = useState<string>("");
  const [scheduledTime, setScheduledTime] = useState<string>("");
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [showSuccess, setShowSuccess] = useState<Boolean>(false);

  useEffect(() => {
    const savedMsgs = localStorage.getItem("scheduledMessages");
    if (savedMsgs) {
      setScheduledMessages(JSON.parse(savedMsgs));
    }
  }, []);

  const handleScheduleMessage = () => {
    if (!message || !email || !scheduledDate || !scheduledTime) {
      alert("Preencha todos os campos!");
      return;
    }

    const newMsg = {
      id: new Date().getTime(),
      message: message,
      email: email,
      scheduledDate: scheduledDate,
      scheduledTime: scheduledTime,
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    const updatedMsgs = [...scheduledMessages, newMsg];
    setScheduledMessages(updatedMsgs);
    localStorage.setItem("scheduledMessages", JSON.stringify(updatedMsgs));

    setMessage("");
    setEmail("");
    setScheduledDate("");
    setScheduledTime("");

    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  };

  const deleteMsg = (msgId) => {
    const filtered = scheduledMessages.filter((msg) => msg.id !== msgId);
    setScheduledMessages(filtered);
    localStorage.setItem("scheduledMessages", JSON.stringify(filtered));
  };

  const formatDateTime = (date, time) => {
    try {
      const dt = new Date(`${date}T${time}`);
      return dt.toLocaleString("pt-BR");
    } catch (error) {
      return "Data inválida";
    }
  };

  const isPending = (date, time) => {
    const now = new Date();
    const msgDate = new Date(`${date}T${time}`);
    return msgDate > now;
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-3xl font-bold text-gray-800">
              Mensagem Do Futuro
            </h1>
          </div>
          <p className="text-gray-600">
            Digite sua mensagem e escolha o dia e a hora para ela ser enviada no
            seu email.
          </p>
        </div>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-600" />
            <span className="text-green-800">Mensagem agendada!</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="w-4 h-4" />
                Mensagem
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {message.length}/500
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Data
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  min={getTodayDate()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Hora
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={handleScheduleMessage}
              className={`w-full font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2
    ${
      !message || !email || !scheduledDate || !scheduledTime
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700 text-white"
    }`}
            >
              <Send className="w-4 h-4" />
              Agendar Mensagem
            </button>
          </div>
        </div>

        {scheduledMessages.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Mensagens ({scheduledMessages.length})
            </h2>
            <div className="space-y-4">
              {scheduledMessages.map((msg) => {
                const isActive = isPending(
                  msg.scheduledDate,
                  msg.scheduledTime
                );
                return (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-lg border ${
                      isActive
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-600">
                            Para: {msg.email}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              isActive
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {isActive ? "Pendente" : "Vencida"}
                          </span>
                        </div>
                        <p className="text-gray-800 mb-2">{msg.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDateTime(
                              msg.scheduledDate,
                              msg.scheduledTime
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteMsg(msg.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
