"use client";

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import { TableColumn } from './TableColumn';
import { Guest, GuestCard } from './GuestCard';
import { ArrowLeft, Plus } from 'lucide-react';
import guestDataRaw from '../guestlist.json';

const guestData = guestDataRaw as Guest[];

interface Table {
  id: string;
  title: string;
  guestIds: string[];
}

interface SeatingData {
  guests: Record<string, Guest>;
  tables: Record<string, Table>;
  tableOrder: string[];
  unassignedGuestIds: string[];
}

export const SeatingChart: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [data, setData] = useState<SeatingData | null>(null);

  useEffect(() => {
    // Try to load from local storage
    const saved = localStorage.getItem('dra50-seating-chart');
    if (saved) {
      setData(JSON.parse(saved));
      return;
    }

    // Initialize from JSON if no saved data
    const guests: Record<string, Guest> = {};
    const unassignedGuestIds: string[] = [];

    guestData.forEach(guest => {
      guests[guest["Submission ID"]] = guest;
      unassignedGuestIds.push(guest["Submission ID"]);
    });

    const initialTables: Record<string, Table> = {
      'table-1': { id: 'table-1', title: 'Table 1', guestIds: [] },
      'table-2': { id: 'table-2', title: 'Table 2', guestIds: [] },
      'table-3': { id: 'table-3', title: 'Table 3', guestIds: [] },
    };

    setData({
      guests,
      tables: initialTables,
      tableOrder: ['table-1', 'table-2', 'table-3'],
      unassignedGuestIds,
    });
  }, []);

  useEffect(() => {
    if (data) {
      localStorage.setItem('dra50-seating-chart', JSON.stringify(data));
    }
  }, [data]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (!data) return;

    // Moving from Unassigned to Unassigned
    if (source.droppableId === 'unassigned' && destination.droppableId === 'unassigned') {
      const newUnassigned = Array.from(data.unassignedGuestIds);
      newUnassigned.splice(source.index, 1);
      newUnassigned.splice(destination.index, 0, draggableId);

      setData({ ...data, unassignedGuestIds: newUnassigned });
      return;
    }

    // Moving out of Unassigned
    if (source.droppableId === 'unassigned') {
      const destTable = data.tables[destination.droppableId];
      if (destTable.guestIds.length >= 10) {
          alert("Table is full (max 10 guests)");
          return;
      }
      const newUnassigned = Array.from(data.unassignedGuestIds);
      newUnassigned.splice(source.index, 1);

      const newDestGuestIds = Array.from(destTable.guestIds);
      newDestGuestIds.splice(destination.index, 0, draggableId);

      setData({
        ...data,
        unassignedGuestIds: newUnassigned,
        tables: {
          ...data.tables,
          [destTable.id]: { ...destTable, guestIds: newDestGuestIds },
        },
      });
      return;
    }

    // Moving into Unassigned
    if (destination.droppableId === 'unassigned') {
      const sourceTable = data.tables[source.droppableId];
      const newSourceGuestIds = Array.from(sourceTable.guestIds);
      newSourceGuestIds.splice(source.index, 1);

      const newUnassigned = Array.from(data.unassignedGuestIds);
      newUnassigned.splice(destination.index, 0, draggableId);

      setData({
        ...data,
        unassignedGuestIds: newUnassigned,
        tables: {
          ...data.tables,
          [sourceTable.id]: { ...sourceTable, guestIds: newSourceGuestIds },
        },
      });
      return;
    }

    // Moving between tables
    const sourceTable = data.tables[source.droppableId];
    const destTable = data.tables[destination.droppableId];

    if (sourceTable === destTable) {
      const newGuestIds = Array.from(sourceTable.guestIds);
      newGuestIds.splice(source.index, 1);
      newGuestIds.splice(destination.index, 0, draggableId);

      setData({
        ...data,
        tables: {
          ...data.tables,
          [sourceTable.id]: { ...sourceTable, guestIds: newGuestIds },
        },
      });
      return;
    }

    // Moving to a different table
    if (destTable.guestIds.length >= 10) {
        alert("Table is full (max 10 guests)");
        return;
    }

    const newSourceGuestIds = Array.from(sourceTable.guestIds);
    newSourceGuestIds.splice(source.index, 1);

    const newDestGuestIds = Array.from(destTable.guestIds);
    newDestGuestIds.splice(destination.index, 0, draggableId);

    setData({
      ...data,
      tables: {
        ...data.tables,
        [sourceTable.id]: { ...sourceTable, guestIds: newSourceGuestIds },
        [destTable.id]: { ...destTable, guestIds: newDestGuestIds },
      },
    });
  };

  const addTable = () => {
    if (!data) return;
    const newId = `table-${data.tableOrder.length + 1}`;
    setData({
      ...data,
      tables: {
        ...data.tables,
        [newId]: { id: newId, title: `Table ${data.tableOrder.length + 1}`, guestIds: [] },
      },
      tableOrder: [...data.tableOrder, newId],
    });
  };

  if (!data) return null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bodoni uppercase tracking-widest font-bold">Seating Arrangement</h1>
            <p className="text-sm text-white/50 tracking-wider">Drag guests to assign tables. Maximum 10 guests per table.</p>
          </div>
        </div>
        <button 
          onClick={addTable}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold text-sm hover:scale-105 transition-transform"
        >
          <Plus size={16} /> Add Table
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-1 overflow-hidden p-6 gap-6 items-start h-[calc(100vh-100px)]">
          {/* Unassigned Guests List */}
          <div className="flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden min-w-[300px] w-[300px] h-full flex-shrink-0">
            <div className="p-4 border-b border-white/10 bg-white/5 sticky top-0 z-10 flex items-center justify-between">
              <h3 className="font-bodoni text-lg font-medium tracking-wide">Unassigned</h3>
              <span className="bg-white/10 text-white/70 text-xs font-semibold px-2 py-1 rounded-full">
                {data.unassignedGuestIds.length}
              </span>
            </div>
            <Droppable droppableId="unassigned">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 overflow-y-auto p-3 transition-colors duration-200 ${
                    snapshot.isDraggingOver ? 'bg-white/5' : ''
                  }`}
                >
                  {data.unassignedGuestIds.map((guestId, index) => {
                    const guest = data.guests[guestId];
                    if (!guest) return null;
                    return <GuestCard key={guest["Submission ID"]} guest={guest} index={index} />;
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          {/* Tables Board */}
          <div className="flex-1 flex overflow-x-auto gap-6 h-full pb-4 items-start pt-2 px-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {data.tableOrder.map(tableId => {
              const table = data.tables[tableId];
              const guests = table.guestIds.map(id => data.guests[id]).filter(Boolean);
              return <TableColumn key={table.id} id={table.id} title={table.title} guests={guests} capacity={10} />;
            })}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};
