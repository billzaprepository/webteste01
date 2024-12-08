import React from 'react';
import { useParams } from 'react-router-dom';
import { Radio } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import LiveChat from '../components/LiveChat';
import WebinarCountdown from '../components/WebinarCountdown';
import { usePublicWebinar } from '../hooks/usePublicWebinar';

const WebinarPage: React.FC = () => {
  const { slug } = useParams();
  const { webinar, isLoading, error } = usePublicWebinar(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading webinar...</p>
        </div>
      </div>
    );
  }

  if (error || !webinar) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {error || 'Webinar not found'}
          </h1>
          <p className="text-gray-600">
            The webinar you are looking for is not available.
          </p>
        </div>
      </div>
    );
  }

  const isLive = new Date() >= webinar.schedule.startTime && 
                 new Date() <= webinar.schedule.endTime;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-800">{webinar.title}</h1>
            {isLive && (
              <div className="flex items-center gap-1.5 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                <Radio size={14} className="animate-pulse" />
                AO VIVO
              </div>
            )}
          </div>
          <p className="text-gray-600">{webinar.description}</p>
        </div>

        {new Date() < webinar.schedule.startTime && (
          <WebinarCountdown startTime={webinar.schedule.startTime} />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <VideoPlayer webinar={webinar} />
          </div>
          <div className="h-[600px]">
            <LiveChat webinar={webinar} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebinarPage;