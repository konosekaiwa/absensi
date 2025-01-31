// app/api/intern/reports/[id]/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { startOfMonth, endOfMonth, eachMonthOfInterval, format } from 'date-fns';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request, context: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const internId = parseInt(context.params.id);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    if (!year || !month || isNaN(parseInt(year)) || isNaN(parseInt(month)) || 
        parseInt(month) < 1 || parseInt(month) > 12) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Fetch intern data
    const intern = await prisma.user.findUnique({
      where: { 
        id: internId
      },
      select: {
        id: true,
        username: true,
        tanggalMasuk: true,
        tanggalKeluar: true,
        activities: {
          where: {
            date: {
              gte: startOfMonth(new Date(parseInt(year), parseInt(month) - 1)),
              lte: endOfMonth(new Date(parseInt(year), parseInt(month) - 1)),
            },
          },
          select: {
            id: true,
            date: true,
            description: true,
          },
        },
        attendance: {
          where: {
            date: {
              gte: startOfMonth(new Date(parseInt(year), parseInt(month) - 1)),
              lte: endOfMonth(new Date(parseInt(year), parseInt(month) - 1)),
            },
          },
          select: {
            id: true,
            date: true,
            status: true,
          },
        },
      },
    });

    if (!intern) {
      return NextResponse.json({ error: 'Intern not found' }, { status: 404 });
    }

    // Get available months
    const availableMonths = eachMonthOfInterval({
      start: intern.tanggalMasuk!,
      end: intern.tanggalKeluar!
    }).map(date => ({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      label: format(date, 'MMMM yyyy')
    }));

    // Generate daily reports
    const startDate = startOfMonth(new Date(parseInt(year), parseInt(month) - 1));
    const endDate = endOfMonth(new Date(parseInt(year), parseInt(month) - 1));
    const reports = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const currentDate = new Date(date);
      
      const activity = intern.activities.find(
        a => new Date(a.date).toDateString() === currentDate.toDateString()
      );
      
      const attendance = intern.attendance.find(
        a => new Date(a.date).toDateString() === currentDate.toDateString()
      );

      reports.push({
        id: activity?.id || Date.now() + reports.length,
        internId: intern.id,
        internName: intern.username,
        date: currentDate.toISOString().split('T')[0],
        activityDescription: activity?.description || 'No Activity',
        attendanceStatus: attendance?.status || 'NO_STATUS',
      });
    }

    return NextResponse.json({
      reports,
      availableMonths,
      currentMonth: {
        year: parseInt(year),
        month: parseInt(month)
      }
    });
  } catch (error) {
    console.error('Error in GET /api/intern/reports/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}